"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopologicalSortGlslRoutines = exports.GlslLibRoutineNode = exports.GlslLibRoutine = exports.GlslLib = exports.GlslContext = exports.FunctionType = void 0;
var FunctionType;
(function (FunctionType) {
    FunctionType[FunctionType["ValueBased"] = 0] = "ValueBased";
    FunctionType[FunctionType["Positional"] = 1] = "Positional";
})(FunctionType = exports.FunctionType || (exports.FunctionType = {}));
var GlslContext = /** @class */ (function () {
    function GlslContext(glContext, programInfo) {
        this.glContext = glContext;
        this.programInfo = programInfo;
    }
    return GlslContext;
}());
exports.GlslContext = GlslContext;
var GlslLib = /** @class */ (function () {
    function GlslLib(context) {
        this.context = context;
    }
    return GlslLib;
}());
exports.GlslLib = GlslLib;
// abstraction to represent a GLSL library routine and it's dependencies
var GlslLibRoutine = /** @class */ (function () {
    function GlslLibRoutine(routineBody, dependencies) {
        this.routineBody = routineBody;
        this.dependencies = dependencies;
    }
    return GlslLibRoutine;
}());
exports.GlslLibRoutine = GlslLibRoutine;
// abstraction to represent a GLSL library routine and it's dependencies AS GRAPH Nodes
// this level of abstraction is used to topologically sort routines before fragment shade inclusion
var GlslLibRoutineNode = /** @class */ (function () {
    function GlslLibRoutineNode(name, routineBody, dependencies) {
        this.name = name;
        if (dependencies) {
            this.dependencies = dependencies;
        }
        else {
            this.dependencies = [];
        }
        if (routineBody) {
            this.routineBody = routineBody;
        }
    }
    GlslLibRoutineNode.prototype.addDependency = function (node) {
        if (node) {
            this.dependencies.push(node);
        }
    };
    return GlslLibRoutineNode;
}());
exports.GlslLibRoutineNode = GlslLibRoutineNode;
// topologically sort GLSL library routines (graph nodes abstraction) before shader script inclusion
var TopologicalSortGlslRoutines = /** @class */ (function () {
    function TopologicalSortGlslRoutines() {
    }
    TopologicalSortGlslRoutines.returnOrderedNodes = function (nodes) {
        if (!nodes || nodes.length === 0) {
            return [];
        }
        if (nodes.length === 1) {
            return nodes;
        }
        var cycleCheck = new Set();
        var alreadyTraversed = new Set();
        var result = new Array();
        this.createOrderedNodes(nodes, cycleCheck, alreadyTraversed, result);
        return result;
    };
    TopologicalSortGlslRoutines.createOrderedNodes = function (graphNodes, cycleCheck, alreadyTraversed, result) {
        for (var i = 0; i < graphNodes.length; ++i) {
            this.dfsTraverse(graphNodes[i], cycleCheck, alreadyTraversed, result);
        }
    };
    TopologicalSortGlslRoutines.dfsTraverse = function (root, cycleCheck, alreadyTraversed, result) {
        // if this root has already been traversed return
        if (!root || alreadyTraversed.has(root.name)) {
            return;
        }
        // cyclic dependency has been detected
        if (cycleCheck.has(root.name)) {
            throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");
        }
        // hold this node to detect cycles if any
        cycleCheck.add(root.name);
        // traverse children in a dfs fashion
        var dependencies = root.dependencies;
        if (dependencies && dependencies.length > 0) {
            for (var i = 0; i < dependencies.length; ++i) {
                this.dfsTraverse(dependencies[i], cycleCheck, alreadyTraversed, result);
            }
        }
        // add to result holder
        result.push(root);
        // mark this node as traversed so that we don't traverse from this again
        alreadyTraversed.add(root.name);
        // release the hold
        cycleCheck.delete(root.name);
    };
    return TopologicalSortGlslRoutines;
}());
exports.TopologicalSortGlslRoutines = TopologicalSortGlslRoutines;
//# sourceMappingURL=glsl-definitions.js.map