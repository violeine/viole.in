
function fetchFavicon(url) {
	return `https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=128`;
}

export function Marks({ marks }) {
	return <div>
		<h4 style={{ color: "black", opacity: "0.9" }}>Title:</h4>
		{marks.map((props) => <Mark {...props} key={props.marks} />)}
	</div>;
}

function Mark(props) {
	const url = new URL(props.marks);
	return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
		<img src={fetchFavicon(url.origin)} alt="url favicon" style={{ width: "16px", aspectRatio: "1/1" }} />
		<a href={props.marks}>{props.desc}</a>
		<span style={{ color: "rbg(0,0,0)", opacity: "0.3" }}>{url.host}</span>
		<div style={{ marginLeft: "auto" }}>
			<Tags tags={props.tags} />
		</div>
	</div>;
}

function Tags({ tags }) {
	return tags.map(tag => (<span key={tag} style={{
		marginRight: "8px"
	}}>#{tag}</span>));
}
