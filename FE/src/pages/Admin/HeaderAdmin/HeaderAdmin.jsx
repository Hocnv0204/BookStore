import "./HeaderAdmin.css";

function Header({ title }) {
  return (
    <header className="header-admin">
      <div className="header-admin-left">
        <h1 className="header-admin-title">{title}</h1>
      </div>
      <div className="header-admin-actions">
        <button className="button primary">
          <span>Reload</span>
        </button>
        <button className="button secondary">
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
