import { useState, useEffect } from 'preact/hooks'

const serializeTheme = (p) => Object.entries(p).map(
  ([k, v]) => `--${k}:${v}`).join(";");

export function Theme() {
  const [theme, setTheme] = useState({
    bg: "#199b8d",/*#005f5a;*/
    app: "#f3e9eb",
    fg: "#000000",
    sel: "#123456",
  });
  useEffect(() => {
    document.body.style = serializeTheme(theme)
  }, [theme])

  return (<div style={{
    display: "flex",
    gap: "8px",
  }}>
    <Picker value={theme.bg} name="bg" setValue={setTheme} />
    <Picker value={theme.sel} name="sel" setValue={setTheme} />
    <Picker value={theme.fg} name="fg" setValue={setTheme} />
    <Picker value={theme.app} name="app" setValue={setTheme} />
  </div>)
}

function Picker({ value, setValue, name }) {
  const inputStyle = {
    visibility: "hidden",
  }
  const labelStyle = {
    backgroundColor: value,
    height: "24px",
    width: "24px",
    border: "solid 1px black"
  }
  return <label style={labelStyle}>
    <input type="color" style={inputStyle}
      name={name}
      value={value}
      onInput={e => setValue((p) => ({ ...p, [name]: e.target.value }))} />
  </label>
} 
