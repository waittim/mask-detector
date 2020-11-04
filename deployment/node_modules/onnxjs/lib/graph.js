"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var attribute_1 = require("./attribute");
var tensor_1 = require("./tensor");
var util_1 = require("./util");
// tslint:disable-next-line:variable-name
exports.Graph = {
    /**
     * construct a graph from a graph protobuf type
     */
    from: function (graphProto, initializer) { return new GraphImpl(graphProto, initializer); }
};
var Value = /** @class */ (function () {
    function Value(valueInfo) {
        this._from = undefined;
        this._to = [];
        this.tensor = undefined;
        this.type = undefined;
        if (valueInfo) {
            this.type = util_1.ProtoUtil.tensorValueTypeFromProto(valueInfo.type.tensorType);
        }
    }
    Object.defineProperty(Value.prototype, "from", {
        get: function () {
            return this._from;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Value.prototype, "to", {
        get: function () {
            return this._to;
        },
        enumerable: false,
        configurable: true
    });
    return Value;
}());
var Node = /** @class */ (function () {
    function Node(_nodeProto) {
        this.name = _nodeProto.name;
        this.opType = _nodeProto.opType;
        this.inputs = [];
        this.outputs = [];
        this.attributes = new attribute_1.Attribute(_nodeProto.attribute);
        this.executeNode = true;
    }
    return Node;
}());
var GraphImpl = /** @class */ (function () {
    function GraphImpl(graph, graphInitializer) {
        if (!graph) {
            throw new TypeError('graph is empty');
        }
        // build the graph - will throw exceptions if something fatal is detected
        this.buildGraph(graph);
        // execute any transformation logic for the graph (if applicable)
        this.transformGraph(graphInitializer);
        // check for cycles and other inconsistencies - will throw exceptions if something fatal is detected
        this.checkIsAcyclic();
    }
    GraphImpl.prototype.getInputIndices = function () {
        return this._allInputIndices;
    };
    GraphImpl.prototype.getInputNames = function () {
        return this._allInputNames;
    };
    GraphImpl.prototype.getOutputIndices = function () {
        return this._allOutputIndices;
    };
    GraphImpl.prototype.getOutputNames = function () {
        return this._allOutputNames;
    };
    GraphImpl.prototype.getValues = function () {
        return this._allData;
    };
    GraphImpl.prototype.getNodes = function () {
        return this._nodes;
    };
    GraphImpl.prototype.buildGraph = function (graph) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
        var dataIndices = new Map();
        this._allData = [];
        this._allInputIndices = [];
        this._allInputNames = [];
        this._allOutputIndices = [];
        this._allOutputNames = [];
        this._nodes = [];
        var nodesIndices = new Map();
        // scan all inputs
        if (!graph.input) {
            throw new Error('missing information in graph: input');
        }
        var inputValueNames = [];
        try {
            for (var _g = __values(graph.input), _h = _g.next(); !_h.done; _h = _g.next()) {
                var i = _h.value;
                if (dataIndices.has(i.name)) {
                    throw new Error("duplicated input name: " + i.name);
                }
                var currentIndex = this._allData.push(new Value(i)) - 1;
                dataIndices.set(i.name, currentIndex);
                inputValueNames.push(i.name);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // scan all initializers
        if (!graph.initializer) {
            throw new Error('missing information in graph: initializer');
        }
        try {
            for (var _j = __values(graph.initializer), _k = _j.next(); !_k.done; _k = _j.next()) {
                var i = _k.value;
                var index = dataIndices.get(i.name);
                if (index === undefined) {
                    var value = new Value();
                    value.type = {
                        shape: { dims: util_1.ProtoUtil.tensorDimsFromProto(i.dims) },
                        tensorType: util_1.ProtoUtil.tensorDataTypeFromProto(i.dataType)
                    };
                    index = this._allData.push(value) - 1;
                    dataIndices.set(i.name, index);
                }
                this._allData[index]._from = -1;
                this._allData[index].tensor = tensor_1.Tensor.fromProto(i);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // filter out input indices
        for (var i = 0; i < this._allData.length; i++) {
            if (!this._allData[i].tensor) {
                this._allInputIndices.push(i);
                this._allInputNames.push(inputValueNames[i]);
            }
        }
        // scan all outputs
        if (!graph.output) {
            throw new Error('missing information in graph: output');
        }
        try {
            for (var _l = __values(graph.output), _m = _l.next(); !_m.done; _m = _l.next()) {
                var i = _m.value;
                if (dataIndices.has(i.name)) {
                    throw new Error("duplicated output name: " + i.name);
                }
                var currentIndex = this._allData.push(new Value(i)) - 1;
                dataIndices.set(i.name, currentIndex);
                this._allOutputIndices.push(currentIndex);
                this._allOutputNames.push(i.name);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_m && !_m.done && (_c = _l.return)) _c.call(_l);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // scan all nodes
        if (!graph.node) {
            throw new Error('missing information in graph: node');
        }
        try {
            for (var _o = __values(graph.node), _p = _o.next(); !_p.done; _p = _o.next()) {
                var nodeProto = _p.value;
                if (!nodeProto.name) {
                    // assign a name to the node if it doesn't have one
                    for (var pick = 0;; pick++) {
                        var name_1 = "unnamed_" + nodeProto.opType + "_" + pick;
                        if (!nodesIndices.has(name_1)) {
                            nodeProto.name = name_1;
                            break;
                        }
                    }
                }
                if (nodesIndices.has(nodeProto.name)) {
                    throw new Error("duplicated node name: " + nodeProto.name);
                }
                var currentIndex = this._nodes.push(new Node(nodeProto)) - 1;
                nodesIndices.set(nodeProto.name, currentIndex);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_p && !_p.done && (_d = _o.return)) _d.call(_o);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // scan node's outputs
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            var nodeProto = graph.node[i];
            if (!nodeProto.output) {
                throw new Error("missing output for node: " + nodeProto.name);
            }
            try {
                for (var _q = (e_5 = void 0, __values(nodeProto.output)), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var output = _r.value;
                    var dataIndex = dataIndices.get(output);
                    if (typeof dataIndex === 'undefined') {
                        dataIndex = this._allData.push(new Value()) - 1;
                        dataIndices.set(output, dataIndex);
                    }
                    node.outputs.push(dataIndex);
                    if (this._allData[dataIndex]._from !== undefined) {
                        throw new Error("multiple nodes output to one data value: " + dataIndex);
                    }
                    this._allData[dataIndex]._from = i;
                    // for the 'Constant' operator, just create a new edge in the graph corresponding to the 'output' of the
                    // operator and ignore the node from the graph
                    if (nodeProto.opType === 'Constant') {
                        if (!nodeProto.attribute || nodeProto.attribute.length !== 1 || !nodeProto.attribute[0].t) {
                            throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");
                        }
                        if (!nodeProto.output || nodeProto.output.length !== 1) {
                            throw new Error("missing output or incorrect number of outputs for this Constant operator");
                        }
                        node.outputs.pop();
                        node.executeNode = false;
                        this._allData[dataIndex]._from = -1;
                        this._allData[dataIndex].tensor = tensor_1.Tensor.fromProto(nodeProto.attribute[0].t);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_e = _q.return)) _e.call(_q);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        // scan node's inputs
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            var nodeProto = graph.node[i];
            if (!nodeProto.input) {
                throw new Error("missing input for node: " + nodeProto.name);
            }
            try {
                for (var _s = (e_6 = void 0, __values(nodeProto.input)), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var input = _t.value;
                    var dataIndex = dataIndices.get(input);
                    if (typeof dataIndex === 'undefined') {
                        throw new Error("unrecognized input '" + input + "' for node: " + nodeProto.name);
                    }
                    node.inputs.push(dataIndex);
                    this._allData[dataIndex]._to.push(i);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_f = _s.return)) _f.call(_s);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        return true;
    };
    GraphImpl.prototype.checkIsAcyclic = function () {
        var _this = this;
        // go through the graph and check for cycles or other fatal inconsistencies
        var starters = new Set();
        this._allInputIndices.forEach(function (i) {
            var data = _this._allData[i];
            data._to.forEach(function (j) {
                starters.add(j);
            });
        });
        // Iterative DFS to check for cycles
        var nodesStack = Array.from(starters);
        var nodesState = new Array(this._nodes.length).fill('white');
        var _loop_1 = function () {
            var nodeIndex = nodesStack.pop();
            // this node has now been processed completely. Mark this node 'black' to denote this.
            if (nodesState[nodeIndex] === 'gray') {
                nodesState[nodeIndex] = 'black';
            }
            else {
                // this node is under processing stage. mark this node 'gray' to denote this.
                nodesStack.push(nodeIndex);
                nodesState[nodeIndex] = 'gray';
                this_1._nodes[nodeIndex].outputs.forEach(function (outgoingEdgeIndex) {
                    var data = _this._allData[outgoingEdgeIndex];
                    if (typeof data.tensor !== 'undefined') {
                        throw new Error("node outputs should not be initialized");
                    }
                    if (data._from !== nodeIndex) {
                        throw new Error("from property of the Value object doesn't match index of Node being processed");
                    }
                    data._to.forEach(function (downstreamNodeIndex) {
                        // back edge found - cyclic
                        if (nodesState[downstreamNodeIndex] === 'gray') {
                            throw new Error("model graph is cyclic");
                        }
                        // tree edge found - continue processing by adding it to stack
                        else if (nodesState[downstreamNodeIndex] === 'white') {
                            nodesStack.push(downstreamNodeIndex);
                        }
                    });
                });
            }
        };
        var this_1 = this;
        while (nodesStack.length > 0) {
            _loop_1();
        }
    };
    GraphImpl.prototype.transformGraph = function (graphInitializer) {
        // apply common transform
        this.removeAllIdentityNodes();
        this.removeAllDropoutNodes();
        // apply initializer specific transform
        if (graphInitializer) {
            graphInitializer.transformGraph(this);
        }
        // finalize graph
        this.finalizeGraph();
    };
    /**
     * finalize the graph.
     *
     * this function should be called after all the transformation completed.
     * this function removes all unnecessary nodes and values from the graph
     */
    GraphImpl.prototype.finalizeGraph = function () {
        var _this = this;
        var offset = 0;
        var _loop_2 = function (i) {
            if (!this_2._nodes[i].executeNode) {
                // delete this node and shift all subsequent nodes up
                offset++;
                // delete all output values
                this_2._nodes[i].outputs.forEach(function (ind) {
                    _this._allData[ind]._from = -2;
                });
                this_2._nodes.splice(i, 1);
                i--;
                return out_i_1 = i, "continue";
            }
            if (offset > 0) {
                // update the value table
                this_2._nodes[i].inputs.forEach(function (value) {
                    var ind = _this._allData[value]._to.indexOf(i + offset);
                    if (ind !== -1) {
                        _this._allData[value]._to[ind] = i;
                    }
                });
                this_2._nodes[i].outputs.forEach(function (value) {
                    if (_this._allData[value]._from && _this._allData[value]._from === i + offset) {
                        _this._allData[value]._from = i;
                    }
                });
            }
            out_i_1 = i;
        };
        var this_2 = this, out_i_1;
        // delete all nodes that are not being executed
        for (var i = 0; i < this._nodes.length; i++) {
            _loop_2(i);
            i = out_i_1;
        }
        offset = 0;
        var _loop_3 = function (i) {
            // if current value is neither linked to next node, nor an output value, remove it.
            if (this_3._allData[i].from === -2 && this_3._allOutputIndices.indexOf(i + offset) === -1) {
                offset++;
                this_3._allData.splice(i, 1);
                i--;
                return out_i_2 = i, "continue";
            }
            if (offset > 0) {
                var ind_1 = -1;
                // if current value is neither an input value nor an initializer, find the node it's
                // coming from and update the corresponding node output
                if (this_3._allData[i].from !== undefined && this_3._allData[i].from !== -1) {
                    ind_1 = this_3._nodes[this_3._allData[i].from].outputs.indexOf(i + offset);
                    if (ind_1 !== -1) {
                        this_3._nodes[this_3._allData[i].from].outputs[ind_1] = i;
                    }
                }
                else {
                    // if current value is an input value, update its reference in inputIndices
                    ind_1 = this_3._allInputIndices.indexOf(i + offset);
                    if (ind_1 !== -1) {
                        this_3._allInputIndices[ind_1] = i;
                    }
                }
                // find the node that the current value is linking to and update its input reference
                this_3._allData[i].to.forEach(function (node) {
                    ind_1 = _this._nodes[node].inputs.indexOf(i + offset);
                    if (ind_1 !== -1) {
                        _this._nodes[node].inputs[ind_1] = i;
                    }
                });
                if (this_3._allData[i].to.length === 0) {
                    // if current value is a graph output, update its reference in outputIndices
                    ind_1 = this_3._allOutputIndices.indexOf(i + offset);
                    if (ind_1 !== -1) {
                        this_3._allOutputIndices[ind_1] = i;
                    }
                }
            }
            out_i_2 = i;
        };
        var this_3 = this, out_i_2;
        // delete all values that are not being referenced
        for (var i = 0; i < this._allData.length; i++) {
            _loop_3(i);
            i = out_i_2;
        }
    };
    /**
     * Delete the specifed node. Assume the node has only one input and the first output connected to other nodes
     * @param nodeIndex The index of node to be deleted
     */
    GraphImpl.prototype.deleteNode = function (nodeIndex) {
        var e_7, _a;
        var node = this._nodes[nodeIndex];
        if (node.inputs.length > 1) {
            throw new Error("Node deletion with multiple inputs is not supported. ");
        }
        if (node.outputs.length > 1) {
            for (var i = 1; i < node.outputs.length; i++) {
                if (this._allData[node.outputs[i]].to.length > 0) {
                    throw new Error("Node deletion with more than one output connected to other nodes is not supported. ");
                }
            }
        }
        // this node wil not be executed
        node.executeNode = false;
        var inputValueIndex = node.inputs[0];
        var outputValueIndex = node.outputs[0];
        var nodesConsumingOutput = this._allData[outputValueIndex].to;
        // remove this node from the to property of the input Value
        var delIndex = this._allData[inputValueIndex].to.indexOf(nodeIndex);
        // should not happen
        if (delIndex === -1) {
            throw new Error("The Value object doesn't have the current Node in it's 'to' property ");
        }
        this._allData[inputValueIndex].to.splice(delIndex, 1);
        // clear node indices consuming this output Value
        this._allData[outputValueIndex]._to = [];
        // if the output of this node is a graph output, adjust the index appropriately
        var index = this._allOutputIndices.indexOf(outputValueIndex);
        if (index !== -1) {
            this._allOutputIndices[index] = inputValueIndex;
        }
        // override the inputs for nodes consuming this node's output with the input to this node
        if (nodesConsumingOutput && nodesConsumingOutput.length > 0) {
            try {
                for (var nodesConsumingOutput_1 = __values(nodesConsumingOutput), nodesConsumingOutput_1_1 = nodesConsumingOutput_1.next(); !nodesConsumingOutput_1_1.done; nodesConsumingOutput_1_1 = nodesConsumingOutput_1.next()) {
                    var nodeIndex_1 = nodesConsumingOutput_1_1.value;
                    var replaceIndex = this._nodes[nodeIndex_1].inputs.indexOf(outputValueIndex);
                    // should not happen
                    if (replaceIndex === -1) {
                        throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");
                    }
                    this._nodes[nodeIndex_1].inputs[replaceIndex] = inputValueIndex;
                    this._allData[inputValueIndex].to.push(nodeIndex_1);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (nodesConsumingOutput_1_1 && !nodesConsumingOutput_1_1.done && (_a = nodesConsumingOutput_1.return)) _a.call(nodesConsumingOutput_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    };
    GraphImpl.prototype.removeAllDropoutNodes = function () {
        var e_8, _a;
        var nodeIndex = 0;
        try {
            for (var _b = __values(this._nodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                // weed out 'Dropout' nodes so that no time is wasted in execution
                if (node.opType === 'Dropout') {
                    // the node should have exactly 1 input and 1 or 2 outputs
                    if (node.inputs.length !== 1) {
                        throw new Error("Dropout nodes should only contain one input. ");
                    }
                    if (node.outputs.length !== 1 && node.outputs.length !== 2) {
                        throw new Error("Dropout nodes should contain either 1 or 2 output(s)");
                    }
                    // the second output should not be referenced by any other node
                    if (node.outputs.length === 2 && this._allData[node.outputs[1]]._to.length !== 0) {
                        throw new Error("Dropout nodes's second output should not be referenced by other nodes");
                    }
                    this.deleteNode(nodeIndex);
                }
                nodeIndex++;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    GraphImpl.prototype.removeAllIdentityNodes = function () {
        var e_9, _a;
        var nodeIndex = 0;
        try {
            for (var _b = __values(this._nodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                // weed out 'Identity' nodes so that no time is wasted in execution
                if (node.opType === 'Identity') {
                    this.deleteNode(nodeIndex);
                }
                nodeIndex++;
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    return GraphImpl;
}());
//# sourceMappingURL=graph.js.map