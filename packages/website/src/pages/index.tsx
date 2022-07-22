import Image from 'next/future/image';
import codeSample from '../assets/code-sample.png';
import logo from '../assets/djs_logo_rainbow_400x400.png';
import vercelLogo from '../assets/powered-by-vercel.svg';
import text from '../text.json';

interface ButtonProps {
	title: string;
}

function Button({ title }: ButtonProps) {
	return (
		<div className="max-h-[70px] bg-blurple px-3 py-4 rounded-lg">
			<p className="font-semibold text-white m-0">{title}</p>
		</div>
	);
}

export default function IndexRoute() {
	return (
		<main className="w-full max-w-full max-h-full h-full flex-col bg-white dark:bg-dark overflow-y-auto">
			<div className="flex h-[65px] sticky top-0 border-b border-slate-300 justify-center px-10 bg-white dark:bg-dark">
				<div className="flex align-center items-center w-full max-w-[1100px] justify-between">
					<div className="h-[50px] w-[50px] rounded-lg overflow-hidden">
						<Image className="h-[50px] w-[50px]" src={logo} />
					</div>
					<div className="flex flex-row space-x-8">
						<a className="text-blurple font-semibold">Docs</a>
						<a className="text-blurple font-semibold">Guide</a>
					</div>
				</div>
			</div>
			<div className="xl:flex xl:flex-col xl:justify-center w-full max-w-full box-border p-10">
				<div className="flex flex-col xl:flex-row grow max-w-[1100px] pb-10 space-y-10 xl:space-x-20 place-items-center place-self-center">
					<div className="flex flex-col max-w-[800px] lt-xl:items-center">
						<h1 className="font-bold text-6xl text-blurple my-2">{text.heroTitle}</h1>
						<p className="text-xl text-dark-100 dark:text-gray-400">{text.heroDescription}</p>
						<div className="flex flew-row space-x-4">
							<Button title="Read the guide" />
							<Button title="Check out the docs" />
						</div>
					</div>
					<div className="sm:flex sm:grow sm:shrink h-full sm:align-center xl:items-center hidden">
						<Image src={codeSample} className="max-w-[600px] h-full rounded-xl shadow-md overflow-hidden" />
					</div>
				</div>
				<div className="flex place-content-center">
					<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss">
						<Image
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							src={vercelLogo}
							alt="Vercel"
							className="max-w-[250px] shadow-md overflow-hidden"
						/>
					</a>
				</div>
			</div>
		</main>
	);
}
