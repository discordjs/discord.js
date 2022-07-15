import codeSample from '../assets/code-sample.png';
import logo from '../assets/djs_logo_rainbow_400x400.png';
import * as text from '../text.json';

interface ButtonProps {
	title: string;
}

function Button({ title }: ButtonProps) {
	return (
		<div className={`max-h-[70px] bg-blurple px-3 py-4 rounded-lg`}>
			<p className="font-semibold color-white m-0">{title}</p>
		</div>
	);
}

export default function IndexRoute() {
	return (
		<main className="w-full max-w-full max-h-full h-full flex-col">
			<div className="flex h-[65px] sticky top-0  border-b border-slate-300 justify-center px-10 bg-white">
				<div className="flex align-center items-center w-full max-w-[1100px] justify-between">
					<div className="h-[50px] w-[50px] rounded-lg overflow-hidden ">
						<img className="h-[50px] w-[50px]" src={logo} />
					</div>
					<div className="flex flex-row space-x-8">
						<a className="color-blurple font-semibold">Docs</a>
						<a className="color-blurple font-semibold">Guide</a>
					</div>
				</div>
			</div>
			<div className={`flex justify-center w-full max-w-full box-border px-10`}>
				<div className="flex flex-row grow max-w-[1100px] mt-10 pb-10 space-x-20">
					<div className="flex flex-col">
						<h1 className={`font-bold text-6xl max-w-[500px] color-blurple mb-2`}>{text.heroTitle}</h1>
						<p className="max-w-[500px] text-xl color-slate-500">{text.heroDescription}</p>
						<div className="flex flew-row space-x-4">
							<Button title="Read the guide" />
							<Button title="Check out the docs" />
						</div>
					</div>
					<div className="flex grow h-full align-center items-center">
						<img src={codeSample} className="max-w-[600px] rounded-xl shadow-md overflow-hidden" />
					</div>
				</div>
			</div>
		</main>
	);
}
