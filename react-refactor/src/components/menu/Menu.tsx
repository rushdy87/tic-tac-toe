import { useState } from 'react';
import classnames from 'classnames';
import './Menu.css';

type Props = {
  onAction(action: 'reset' | 'new-round'): void;
};

const Menu = ({ onAction }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="menu">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          Actions
          <i
            className={classnames(
              'fa-solid',
              menuOpen ? 'fa-chevron-up' : 'fa-chevron-down'
            )}
          ></i>
        </button>

        {menuOpen && (
          <div className="items border">
            <button onClick={() => onAction('reset')}>Reset</button>
            <button onClick={() => onAction('new-round')}>New Round</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
