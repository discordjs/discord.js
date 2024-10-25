/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface ParsedTextProps {
	readonly text: string;
}

export const ParsedText: React.FC<ParsedTextProps> = ({ text }) => {
	return (
		<ReactMarkdown
			rehypePlugins={[rehypeRaw]} // Parses raw HTML in markdown
			components={{
				strong: ({ children }) => <strong>{children}</strong>, // Renders bold text
				a: ({ children, href }) => (
					<a href={href} rel="noopener noreferrer">
						{children}
					</a>
				), // Renders links
			}}
		>
			{text}
		</ReactMarkdown>
	);
};
