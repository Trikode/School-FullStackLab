import { useEffect } from "react";
import { TransitionElement } from "../../layout/TransitionElement";

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

const InputWithLabelStyle = {
  width: '100%',
  height: '3.5rem',
  padding: '0 1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--borderBlack)',
  backgroundColor: 'var(--bgGrey)',
  cursor: 'pointer',
  outline: 'none',
};

const InputStyle = {
  width: '100%',
  height: '4.5rem',
  background: 'none',
  border: 'none',
  outline: 'none',
  caretColor: 'black'
};

export default function InputLabel({
  widthValue = '100%',
  fieldWidth = '100%',
  label = null,
  value = null,
  maxValueChar = null,
  placeholder = '',
  isUsername = false,
  isDescription = false,
  isOptional = false,
  descHeights = ['5.5rem', '3.5rem'],
  Element = null, // Could be the character counter or a symbol for the label
  type = 'text',
  inputmode = 'text',
  onChange,
  clearFunction = null,
}) {
  return (
    <div
      className="Flex Column Small"
      style={{
        width: widthValue,
        alignItems: 'flex-start',
      }}>
      {label && (
        <div
          className="Full Flex"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <label
            style={{
              height: '2rem',
              marginLeft: '0.2rem',
            }}>
            {label}
            {isOptional &&
              <span className="SecondaryText">&nbsp;(optional)</span>
            }
          </label>

          {Element}
        </div>
      )}

      {isDescription ? (
        <div
          className="Flex Center"
          style={{
            ...InputWithLabelStyle,
            height: descHeights[0],
          }}>
          <textarea
            value={value}
            placeholder={placeholder}
            maxLength={maxValueChar}
            onChange={onChange}
            // Disable browser suggestions
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{
              ...InputStyle,
              height: descHeights[1],
              resize: 'none',
            }}
          />
        </div>
      ) : (
        <div
          className="Full Flex"
          style={{ ...InputWithLabelStyle, width: fieldWidth }}>
          {isUsername && (
            <div
              className="Flex Center SecondaryText"
              style={{
                height: '4.5rem',
              }}>
              <Asperand />
            </div>
          )}
          <div className="Full Flex Center" style={{ justifyContent: 'space-between' }}>
            <input
              value={value}
              maxLength={maxValueChar}
              type={type}
              inputMode={inputmode}
              placeholder={placeholder}
              onChange={onChange}
              // Disable browser suggestions
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              style={InputStyle}
            />
            {clearFunction && value && (
              <ClearFilter onClick={clearFunction} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Asperand() {
  return (
    <span
      style={{
        fontFamily: 'System-ui',
        marginTop: '-0.25rem',
      }}>@</span>
  );
}

function ClearFilter({ onClick }) {
  return (
    <TransitionElement>
      <button
        className="Flex Center"
        onClick={onClick}
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          background: 'white',
        }}>
        <img src="/X.svg" style={{ height: '0.85rem' }} />
      </button>
    </TransitionElement>
  );
}
