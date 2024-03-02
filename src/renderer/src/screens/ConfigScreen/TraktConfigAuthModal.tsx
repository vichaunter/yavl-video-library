import { useEffect, useRef, useState } from 'react';
import {
  FaClipboard,
  FaClipboardCheck,
  FaExternalLinkAlt,
  FaTimes,
} from 'react-icons/fa';
import { TraktAuthorization } from '../../../../main/api/trakt';
import { copyToClipboard } from '../../../helpers';
import { api } from '../../api/apiMedia';
import useConfigStore from '../../store/useConfigStore';

type Props = {
  onClose?: () => void;
};
const TraktConfigAuthModal = ({ onClose }: Props) => {
  const [copied, setCopied] = useState(false);
  const [reloadConfig] = useConfigStore((state) => [state.load]);
  const [auth, setAuth] = useState<TraktAuthorization>();
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function authorize() {
      const authorization = await api.authorizeTrakt();
      setAuth(authorization);
      interval.current = setInterval(async () => {
        reloadConfig();
      }, 1000);
    }
    if (!interval.current) {
      authorize();
    }
    return () => clearInterval(interval.current);
  }, []);

  const handleCopyCode = () => {
    auth?.user_code && copyToClipboard(auth.user_code, () => setCopied(true));
  };

  if (!auth) return <div className="modal">Loading... </div>;

  return (
    <div className="modal">
      <div className="close">
        <FaTimes onClick={onClose} />
      </div>
      <div className="code" onClick={handleCopyCode}>
        {auth.user_code}
        {copied ? <FaClipboardCheck /> : <FaClipboard />}
      </div>
      <div>
        <button
          className="link"
          onClick={() => {
            api.openExternalLink(auth.verification_url);
          }}
        >
          Open auth page and insert the code
          <FaExternalLinkAlt />
        </button>
      </div>
    </div>
  );
};

export default TraktConfigAuthModal;
