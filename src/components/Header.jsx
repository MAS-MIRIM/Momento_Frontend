import styled from "styled-components";
import logo from "../assets/logo.png";
import bell from "../assets/bell.png";

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const Bell = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Head = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 12px 42px 12px;
`;

const Header = () => {
  return (
    <Head>
      <Logo src={logo} alt="logo" />
      <Bell src={bell} alt="notifications" />
    </Head>
  );
};

export default Header;
