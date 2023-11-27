export type FloaterProps = {
	distance: number;
	duration: number;
	reverse?: boolean;
	children?: React.ReactNode;
};
const Floater = ({
	distance,
	duration,
	reverse = false,
	children,
}: FloaterProps) => {
	return (
		<div
			className="float"
			style={{
				// @ts-expect-error - this value works but throws a typescript error
				'--distance': `${distance}px`,
				'--duration': `${duration}s`,
				'--reverse': reverse ? '-1' : '1',
			}}
		>
			{children}
		</div>
	);
};

export { Floater };
