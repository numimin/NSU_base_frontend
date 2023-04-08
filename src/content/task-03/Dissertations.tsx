function Dissertations(props: {dissertations: string[]}) {
	return <div className="List">
		<h2>Диссертации</h2>
		<ol>
			{
				props.dissertations.map(d => {
					if (d === null) return <></>;
					return <p className="header not_expandable" key={d}>{d}</p>;
				})
			}
		</ol>
	</div>;
}

export default Dissertations;