import { FormEvent, useState } from 'react';
import { TraktConfig } from '../../../../main/api/trakt';
import ScreenSection from '../../components/ScreenSection';
import useConfigStore from '../../store/useConfigStore';
import { FaCheckCircle } from 'react-icons/fa';

const TraktConfig = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig, saveConfig] = useConfigStore((state) => [
    state.config.trakt,
    state.setConfig,
    state.persist,
  ]);

  const isValid = (name: string, value: string) => {
    if (['clientId', 'clientSecret'].includes(name) && value.length !== 64) {
      return false;
    }
    if (name === 'username' && !value) {
      return false;
    }
    return true;
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
    if (!isValid(name, value)) {
      return console.log('invalid', name, !value);
    }

    setConfig('trakt', {
      ...config,
      [name]: value,
    });
  };

  return (
    <ScreenSection title="Trakt API">
      <>
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
          <button
            type="submit"
            disabled={
              !config?.username ||
              !config?.clientId ||
              !config?.clientSecret ||
              saved
            }
          >
            {saved ? (
              <>
                <FaCheckCircle /> Saved
              </>
            ) : (
              'Save Trakt config'
            )}
          </button>
        </form>
      </>
    </ScreenSection>
  );
};

export default TraktConfig;
