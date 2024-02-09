import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import './passwordeye.css'

const PasswordEye = ({ showPassword, setshowPassword }) => {
  return (
    <>
      <button
        className="bg-transparent showPasswordButton"
        onClick={() => setshowPassword(!showPassword)}
        type="button"
      >
        {showPassword ? <BsFillEyeFill /> :  <BsFillEyeSlashFill />}
      </button>
    </>
  );
};

export default PasswordEye;