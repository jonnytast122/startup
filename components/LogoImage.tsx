// Example for Advice 4: Performance Optimization - Use Next.js <Image />

import Image from 'next/image';

const LogoImage = () => (
  <Image src="/logo.png" alt="Logo" width={100} height={100} />
);

export default LogoImage;