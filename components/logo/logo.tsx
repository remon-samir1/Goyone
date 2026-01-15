import Link from "next/link";
import Image from "next/image";
interface LogoTypes {
  width?: number;
  height?: number;
}
const Logo = ({ width, height }: LogoTypes) => {
  return (
    <div>
      <Link href="/">
        <Image
          src="./Goyone-logo.svg"
          alt="goyone"
          width={width || 180}
          height={height || 60}
        />
      </Link>
    </div>
  );
};

export default Logo;
