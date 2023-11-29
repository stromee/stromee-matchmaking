export type ProseProps = {
	children: string;
};

const Prose = ({ children }) => {
	if (children[0] === '<') {
		return (
			<div
				className="prose"
				dangerouslySetInnerHTML={{
					__html: children,
				}}
			/>
		);
	}

	return (
		<div className="prose">
			<p dangerouslySetInnerHTML={{ __html: children }} />
		</div>
	);
};

export { Prose };
