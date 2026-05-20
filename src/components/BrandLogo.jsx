import { APP_LOGO, APP_NAME } from '../constants/brand';

export default function BrandLogo({ size = 40, className = '' }) {
  return (
    <img
      src={APP_LOGO}
      alt={`${APP_NAME} logo`}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
