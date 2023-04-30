import {signal} from '@preact/signals';

const displaySignal = signal([]);

export const web =(display) => {
  displaySignal.value=[...display];
}

export const Display = () => {
  const w=8; 
  const h=8;
  return (<div style={{
    width: `${w*64}px`,
    height: `${h*32}px`,
		margin: 0,
		padding: 0,
		display:"flex",
		flexWrap: 'wrap'
  }}>
		 {displaySignal.value.map((e,i)=> <div style={{
			width:w,
			height:h,
			background: e ? "var(--fg)": "var(--app)",
			display:"inline-block",
			padding: 0
		}} key={i}/>)}
  </div>)
}

