import { Loader as asaasasas } from '../../../assets';
import './Loader.css';
interface LoaderProps {
  isLoad: boolean
}

export const LoaderFullscreen: React.FC<LoaderProps> = ({ isLoad }) =>
  !isLoad
    ? null
    : <div className="rotatingBackground">
      <Loader isLoad={isLoad} />
    </div>

export const Loader: React.FC<LoaderProps> = ({ isLoad }) =>
  !isLoad
    ? null
    : <img
      src={asaasasas}
      alt="Loading..."
      className="rotating"
    />