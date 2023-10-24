import { motion } from "framer-motion";

export const iconSize = {
  width: '1.45rem',
  height: '1.45rem',
};

export const blackGradientButtonStyle = {
  background: 'var(--blackGradient)',
  padding: '1.2rem 2.2rem',
  color: 'white',
  border: 'none',
  borderRadius: '5rem',
  cursor: 'pointer',
};

export const greyButtonStyle = {
  backgroundColor: 'var(--bgGrey)',
  padding: '0.8rem 1.2rem',
  border: '1px solid var(--borderBlack)',
  borderRadius: '0.5rem',
};

export default function Button({
  text = '',
  onClick = () => { },
  disabled = false,
}) {
  if (disabled) {
    return (
      <div
        style={{ ...blackGradientButtonStyle, opacity: 0.2 }}>
        <p className="Mid">{text}</p>
      </div>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      onClick={onClick}
      style={blackGradientButtonStyle}>
      <p className="Mid">{text}</p>
    </motion.button>
  );
}

export function ButtonGrey({
  text = '',
  onClick = () => { },
  disabled = false,
}) {
  if (disabled) {
    return (
      <div
        style={{ ...greyButtonStyle, opacity: 0.2 }}>
        <p className="Mid">{text}</p>
      </div>
    );
  }
  return (
    <button
      className="Flex Center Pointer"
      onClick={onClick}
      style={greyButtonStyle}>
      <p className="Mid">{text}</p>
    </button>
  );
}

export function IconButton({
  icon,
  onClick = () => { },
}) {
  return (
    <button
      className="Flex Center"
      onClick={onClick}>
      <img src={icon} alt="Icon" style={iconSize} />
    </button>
  );
}

export function ContentInput({ label, Element }) {
  return (
    <label
      className="Flex Center"
      style={{
        height: '3.5rem',
        width: '15rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--borderBlack)',
        backgroundColor: 'var(--bgGrey)',
        cursor: 'pointer',
        outline: 'none',
        gap: '0.8rem',
      }}>
      {Element}
      <img src="/UploadImage.svg" style={{ height: '1.18rem' }} />
      <p className="Mid">{label}</p>
    </label>
  );
}

export function ButtonRemoveContent({ onClick }) {
  return (
    <button
      className="Flex Center"
      onClick={onClick}
      style={{
        height: '3.5rem',
        width: '15rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--borderBlack)',
        backgroundColor: 'var(--bgGrey)',
        cursor: 'pointer',
        outline: 'none',
        gap: '0.8rem',
      }}>
      <img src="/Remove.svg" style={{ height: '1.20rem' }} />
      <p className="Mid"> Remove content </p>
    </button>
  );
}

// Sign-in and Sign-up buttons
export function ButtonSocialLogin({
  children,
  background = 'var(--bgGrey)',
  color = 'black',
  onClick,
}) {
  return (
    <button
      className="Flex Center"
      onClick={onClick}
      style={{
        padding: '0 3.2rem 0 2.5rem',
        height: '4.5rem',
        gap: '1rem',
        background: background,
        color: color,
        borderRadius: '0.85rem',
        cursor: 'pointer',
      }}>
      {children}
    </button>
  );
}

export function ButtonRouterBack({
  moreStyle = {},
  onClick,
}) {
  return (
    <div
      className='Flex Center'
      style={{ cursor: 'pointer', ...moreStyle }}
      onClick={onClick}>
      <img
        src="/Back.svg"
        style={iconSize} />
      <p className='Mid SecondaryText onHover'>Back</p>
    </div>
  );
}

export function ButtonClose({ onClick }) {
  return (
    <button
      className="Flex Center"
      onClick={onClick}>
      <img
        src="/X.svg"
        style={{
          width: '2rem',
          height: '2rem'
        }}
      />
    </button>
  );
}

const dotStyle = {
  width: '0.15rem',
  height: '0.15rem',
  borderRadius: '50%',
  backgroundColor: 'var(--bgGreyDarker)',
};

const ThreeDotsIcon = () => {
  return (
    <div
      className='Flex Column Center'
      style={{ gap: '0.2rem' }}>
      <div style={dotStyle} />
      <div style={dotStyle} />
      <div style={dotStyle} />
    </div>
  );
};