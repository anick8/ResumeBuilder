/**
 * Hover-revealed remove / move buttons for one item of a list.
 * @param {{
 *   onRemove: () => void,
 *   onUp?: () => void,
 *   onDown?: () => void,
 *   light?: boolean,
 * }} props
 */
export function ItemControls({ onRemove, onUp, onDown, light = false }) {
  const cls = `ctl-btn ${light ? "ctl-light" : ""}`;
  return (
    <span className="no-print item-controls">
      {onUp && (
        <button type="button" className={cls} onClick={onUp} title="Move up">
          ↑
        </button>
      )}
      {onDown && (
        <button
          type="button"
          className={cls}
          onClick={onDown}
          title="Move down"
        >
          ↓
        </button>
      )}
      <button
        type="button"
        className={`${cls} ctl-danger`}
        onClick={onRemove}
        title="Remove"
      >
        ×
      </button>
    </span>
  );
}

/**
 * An "add" button shown below a list.
 * @param {{ onClick: () => void, label: string, light?: boolean }} props
 */
export function AddButton({ onClick, label, light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`no-print add-btn ${light ? "add-light" : ""}`}
    >
      + {label}
    </button>
  );
}
