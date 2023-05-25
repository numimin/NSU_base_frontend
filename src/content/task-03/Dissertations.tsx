function Dissertations(props: {dissertations: string[]}) {
	return <div>
		<h2 className="ListHeader">Диссертации</h2>
		<ol className="List">
			{
				props.dissertations.map(d => {
					if (d === null) return <></>;
					return <li className="header not_expandable" key={d}>{d}</li>;
				})
			}
		</ol>
	</div>;
}

export default Dissertations;