// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Keeps track of a directed graph traversal that needs to detect cycles.
 */
export enum VisitorState {
  /**
   * We have not visited the node yet.
   */
  Unvisited = 0,

  /**
   * We have visited the node, but have not finished traversing its references yet.
   * If we reach a node that is already in the `Visiting` state, this means we have
   * encountered a cyclic reference.
   */
  Visiting = 1,

  /**
   * We are finished vising the node and all its references.
   */
  Visited = 2
}
