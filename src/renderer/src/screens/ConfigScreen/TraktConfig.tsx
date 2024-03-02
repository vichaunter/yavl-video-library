import { FormEvent, useEffect, useState } from 'react';
import { FaCheckCircle, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { SiTrakt } from 'react-icons/si';
import styled from 'styled-components';
import { TraktAuthorization, TraktConfig } from '../../../../main/api/trakt';
import { api } from '../../api/apiMedia';
import ScreenSection from '../../components/ScreenSection';
import useConfigStore from '../../store/useConfigStore';
import TraktConfigAuthModal from './TraktConfigAuthModal';

const Styled = styled(ScreenSection)`
  position: relative;

  .modal {
    z-index: 10;
    background-color: var(--pico-background-color);
    position: absolute;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .code {
      position: relative;
      font-size: 3rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      cursor: pointer;

      svg {
        font-size: 1rem;
        position: absolute;
        top: 1rem;
        right: -2rem;
      }
    }
    .button {
      font-size: 1rem;
      text-decoration: none;
    }
  }
`;

const isValid = (name: string, value: string) => {
  if (['clientId', 'clientSecret'].includes(name) && value.length !== 64) {
    return false;
  }
  if (name === 'username' && !value) {
    return false;
  }
  return true;
};

const TraktConfig = () => {
  const [saved, setSaved] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [config, setConfig, saveConfig] = useConfigStore((state) => [
    state.config.trakt,
    state.setConfig,
    state.persist,
  ]);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saved = await saveConfig();
    if (saved) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //TODO: Fix this to allow write in the input invalid values
    if (!isValid(name, value)) {
      return console.log('invalid', name, !value);
    }

    setConfig('trakt', {
      ...config,
      [name]: value,
    });
  };

  const isAllData =
    config?.username && config?.clientId && config?.clientSecret;

  return (
    <Styled title="Trakt API">
      {isAuthorizing && (
        <TraktConfigAuthModal onClose={() => setIsAuthorizing(false)} />
      )}
      <form onSubmit={handleSave}>
        <fieldset>
          <label>
            Username:
            <input
              name="username"
              type="text"
              placeholder="myusername"
              onChange={handleOnChange}
              value={config?.username}
            />
          </label>
          <label>
            Client ID:
            <input
              name="clientId"
              type="text"
              placeholder="o0ajsdp8f0asd7hf0789ahs0f7ysa..."
              onChange={handleOnChange}
              value={config?.clientId}
            />
          </label>
          <label>
            Client Secret:
            <input
              name="clientSecret"
              type="password"
              placeholder="o0ajsdp8f0asd7hf0789ahs0f7ysa..."
              onChange={handleOnChange}
              value={config?.clientSecret}
            />
          </label>
        </fieldset>
        <div className="grid">
          <button type="submit" disabled={!isAllData || saved}>
            {saved ? (
              <>
                <FaCheckCircle /> Saved
              </>
            ) : (
              'Save Trakt config'
            )}
          </button>
          <button
            type="button"
            disabled={!isAllData || isAuthorizing}
            onClick={handleAuthorize}
          >
            {config?.accessToken ? (
              `Trakt logged in`
            ) : isAuthorizing ? (
              <>
                {`Authorizing `} <FaSpinner className="spin" />
              </>
            ) : (
              `Start authorization`
            )}
          </button>
          <div className="grid">
            <button
              className="link"
              type="button"
              onClick={() => {
                api.openExternalLink('https://trakt.tv/oauth/applications');
              }}
            >
              {`Browse your apps `}
              <FaExternalLinkAlt />
            </button>
          </div>
        </div>
      </form>
    </Styled>
  );
};

export default TraktConfig;
