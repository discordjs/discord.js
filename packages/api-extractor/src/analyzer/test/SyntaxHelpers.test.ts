// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { SyntaxHelpers } from '../SyntaxHelpers.js';

describe(SyntaxHelpers.name, () => {
	it(SyntaxHelpers.makeCamelCaseIdentifier.name, () => {
		// prettier-ignore
		const inputs:string[] = [
      '',
      '@#(&*^',
      'api-extractor-lib1-test',
      'one',
      'one-two',
      'ONE-TWO',
      'ONE/two/ /three/FOUR',
      '01234'
    ];

		expect(
			inputs.map((x) => {
				return { input: x, output: SyntaxHelpers.makeCamelCaseIdentifier(x) };
			}),
		).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "input": "",
			    "output": "_",
			  },
			  Object {
			    "input": "@#(&*^",
			    "output": "_",
			  },
			  Object {
			    "input": "api-extractor-lib1-test",
			    "output": "apiExtractorLib1Test",
			  },
			  Object {
			    "input": "one",
			    "output": "one",
			  },
			  Object {
			    "input": "one-two",
			    "output": "oneTwo",
			  },
			  Object {
			    "input": "ONE-TWO",
			    "output": "oneTwo",
			  },
			  Object {
			    "input": "ONE/two/ /three/FOUR",
			    "output": "oneTwoThreeFour",
			  },
			  Object {
			    "input": "01234",
			    "output": "_01234",
			  },
			]
		`);
	});
});
