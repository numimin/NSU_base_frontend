function Dissertations(props: {dissertations: string[]}) {
	return <>
		<h2>Диссертации:</h2>
		<ol>
			{
				props.dissertations.map(d => {
					return <p>{d}</p>;
				})
			}
		</ol>
	</>;
}

export default Dissertations;