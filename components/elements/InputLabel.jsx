import { useEffect } from "react";

export function ListSelection({
  showList,
  onClickShowList,
  DynamicLabel,
  ListMapping,
}) {

  useEffect(() => {
    function handleOutsideClick(e) {
      if (showList) {
        if (!e.target.closest(".ListSelectionCloseHandler")) {
          onClickShowList();
        }
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showList]);

  return (
    <div
      className="Flex Column Small ListSelectionCloseHandler"
      style={{
        alignItems: 'flex-start',
        position: 'relative',
      }}>
      <div
        className="Flex"
        onClick={onClickShowList}
        style={{
          width: '100%',
          height: '3.5rem',
          padding: '0 1rem 0 1rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--borderBlack)',
          backgroundColor: 'var(--bgGrey)',
          cursor: 'pointer',
          outline: 'none',
        }}>
        <div
          className="Full Flex"
          style={{
            gap: '1rem',
            alignItems: 'center',
          }}>
          {DynamicLabel}
          <img
            className="Icon"
            src="/Expand.svg"
            style={{
              width: '0.7rem',
              height: '0.7rem',
              transform: showList ? '' : 'rotate(180deg)',
            }}
          />
        </div>
      </div>
      {showList && (
        <ul
          className="Full Flex Column StartLeft"
          style={{
            zIndex: 100,
            position: 'absolute',
            top: '4rem',
            backgroundColor: 'var(--bgGrey)',
            borderRadius: '0.5rem',
            border: '1px solid var(--borderBlack)',
            overflow: 'hidden',
          }}>
          {ListMapping}
        </ul>
      )}
    </div>
  );
}

export default function InputLabel({
  widthValue = '15rem',
  label,
  type = 'text',
  inputmode = 'text',
  value = '',
  maxValueChar = 300,
  placeholder = '',
  onChange,
}) {
  return (
    <div
      className="Flex Column"
      style={{
        width: widthValue,
        alignItems: 'flex-start',
      }}>
      <label className="Small" style={{ height: '1.5rem', marginLeft: '0.3rem' }}>{label}</label>
      <div
        className="Flex"
        style={{
          width: '100%',
          height: '3.5rem',
          padding: '0 1rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--borderBlack)',
          backgroundColor: 'var(--bgGrey)',
          cursor: 'pointer',
          outline: 'none',
        }}>
        <input
          className="Small"
          style={{
            width: '100%',
            height: '3.5rem',
            background: 'none',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            caretColor: 'black',
          }}
          type={type}
          inputMode={inputmode}
          value={value}
          maxLength={maxValueChar}
          placeholder={placeholder}
          onChange={onChange}
          // Disable browser suggestions
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}