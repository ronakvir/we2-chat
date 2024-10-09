
import iRemindlogo from "../../assets/images/we2logo.png";

const handleLogoKeyPress = (event: { key: string }) => {
  if (event.key === "Enter" || event.key === " ") {
    window.location.href = `http://localhost:8000/`;
  }
};

const Chat = () => {
  return (
    <div>
      <div className="text-center logo-top">
        <button
          aria-label="Click to go back to the username input"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          type="button"
          onKeyDown={handleLogoKeyPress}
          >
          <img
            alt="iRemind Logo"
            className="my-4"
            src={iRemindlogo}
            style={{ width: "200px", height: "auto" }}
          />
        </button>
      </div>
      <h1>Lets chat</h1>
    </div>
  );
};

export default Chat;
