import { ButtonClose } from "../components/elements/Button";

export const styleUnderline = {
  position: 'absolute',
  bottom: '-1px',
  left: '0',
  right: '0',
  height: '1px',
  backgroundColor: 'var(--borderBlack)',
};

export const modalStyle = {
  marginTop: '5rem',
  borderRadius: '1rem',
  padding: 'unset',
  boxShadow: 'none',
};

export function ModalLayout({
  className = 'Full Flex Column StartLeft',
  isCentered = false,
  gap = '2rem',
  title,
  fontTitle = 'Bold Big',
  paddingHeader = '0.5rem 0rem',
  padding = '2rem 2rem 1.8rem',
  width = null,
  onClose,
  children
}) {
  return (
    <div
      className={isCentered ? 'Full Flex Column Center' : className}
      style={width ?
        { width: width, gap: gap, padding: padding } :
        { gap: gap, padding: padding }
      }>
      <div
        className="Full Flex"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: paddingHeader,
        }}>
        <p className={fontTitle}> {title} </p>

        <ButtonClose
          onClick={onClose}
        />
      </div>
      {children}
    </div>
  );
}