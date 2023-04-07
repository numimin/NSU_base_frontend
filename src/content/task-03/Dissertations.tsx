function Dissertations(props: {dissertations: string[]}) {
	return <div>
		<h2>Диссертации:</h2>
		<ol>
			{
				props.dissertations.map(d => {
					return <p key={d}>{d}</p>;
				})
			}
		</ol>
	</div>;
}

export default Dissertations;