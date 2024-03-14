import { CSSProperties } from "react"
import { useLocation, useNavigate } from "react-router-dom"
export const AuthRequiredButton: React.FC<{ show: boolean }> = ({ show }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate()
  return !show
    ? null
    : <div style={{ position: "relative" }}>
        <button 
          style={{ ...styles.authRequired, visibility: "hidden", marginTop: "0.75rem" } as CSSProperties}
        >
            Требуется регистрация
        </button>
        <button 
          onClick={() => { navigate("/registration") }}
          style={{ 
            ...styles.authRequired, 
            marginTop: "0.75rem",
            position: "fixed", 
            top: 0, 
            left: 0,
            right: 0,
            zIndex: 2,
          } as CSSProperties }
        >
          Требуется регистрация
        </button>
      </div>
}

const styles = {
  authRequired: {
    width: "100%",
    fontSize: "18px", 
    fontWeight: "400",
    textTransform: "uppercase", 
    padding: "18px", 
    background: "#FFF100", 
    borderRadius: "8px",
  },
}


export const AuthRequired: React.FC<{ show: boolean }> = ({ show }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const isRegistrationPage = pathname.split('/').includes('registration')
  const isLoginPage = pathname.split('/').includes('login')
  return !show || isRegistrationPage || isLoginPage
    ? null
    : <button 
        onClick={() => { navigate("/registration") }}
        style={styles.authRequired as CSSProperties}
      >
        Требуется регистрация
      </button>
}