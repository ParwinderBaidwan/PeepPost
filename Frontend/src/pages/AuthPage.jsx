import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
    // similar to useState => const [value , setValue] = useState("login");
    console.log(authScreenState);
  return (
    <>
        {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </>
  )
}

export default AuthPage