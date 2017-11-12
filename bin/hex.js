#!/usr/bin/env node
const fs = require("fs");
const Compiler = require("hex-compiler").Compiler;
const path = require("path");
const chokidar = require("chokidar");
const getAllFileNames = require("./util").getAllFileNames;

const dtsRegex = /\.d\.ts$/;

const command = process.argv[2].toLowerCase();

let compiler = null;

switch (command) {
    case "build-editor":
        buildEditor();
        break;
    case "build-spec":
        buildSpecs();
        break;
    case "watch-editor":
        watchEditor();
        break;
    case "watch-spec":
        watchSpec();
        break;
}

function watchEditor() {

    const watcher = chokidar.watch(path.resolve("./src"), {
        persistent: true
    });

    //todo stupid mode! make this cached per file
    watcher.on('ready', function () {
        buildEditor();
        watcher
            .on('add', function (filePath) {
                buildEditor();
            })
            .on('change', function (filePath) {
                buildEditor();
            })
            .on('unlink', function (filePath) {
                buildEditor();
            });
    });

}

function watchSpec() {
    const watcher = chokidar.watch([path.resolve("./src"), path.resolve("./spec")], {
        ignored: /node_modules\/*/,
        persistent: true
    });
    /**/
    //todo stupid mode! make this cached per file
    watcher.on('ready', function () {

        buildSpecs();
        watcher
            .on('add', function (filePath) {
                buildSpecs();
            })
            .on('change', function (filePath) {
                if(filePath.indexOf("spec_bundle") !== -1) {
                    return;
                }
                buildSpecs();
            })
            .on('unlink', function (filePath) {
                buildSpecs();
            });
    });
}

function buildEditor() {
    var start = Date.now();

    const dtsFiles = getAllFileNames([
        "./src",
        "./node_modules/@types"
    ],dtsRegex);

    const files = [
        path.resolve("./src/editor/main.tsx"),
    ].concat(dtsFiles);

    compiler = new Compiler(files);
    compiler.addDecoratorMutator(require("../mutators/input_event_mutator"));
    compiler.addDecoratorMutator(require("../mutators/tag_type_mutator"));
    compiler.addDecoratorMutator(require("../mutators/unique_component_mutator"));
    compiler.addDecoratorMutator(require("../mutators/require_component_mutator"));
    compiler.addDecoratorMutator(require("../mutators/app_event_mutator"));
    compiler.addVisitor(require("../mutators/inline_visitor"));
    var StructVisitor = require("hex-compiler/src/struct_visitor.js").StructVisitor;
    compiler.addVisitor(new StructVisitor());
    const compileResult = compiler.compile();
    if (compileResult) {
        fs.writeFileSync(path.resolve("./build/editor.js"), compileResult);
    }
    console.log("compiled in", (Date.now() - start), "ms");

}


function buildSpecs() {
    var start = Date.now();
    const specRegex = /_spec.ts$/;

    const dtsFiles = getAllFileNames([
        "./src",
        "./spec",
        "./node_modules/@types",
    ], dtsRegex);
    const files = getAllFileNames("./spec", specRegex).concat(dtsFiles);
    compiler = new Compiler(files);
    compiler.addDecoratorMutator(require("../mutators/input_event_mutator"));
    compiler.addDecoratorMutator(require("../mutators/tag_type_mutator"));
    compiler.addDecoratorMutator(require("../mutators/unique_component_mutator"));
    compiler.addDecoratorMutator(require("../mutators/require_component_mutator"));
    compiler.addDecoratorMutator(require("../mutators/app_event_mutator"));
    compiler.addVisitor(require("../mutators/inline_visitor"));
    var StructVisitor = require("hex-compiler/src/struct_visitor.js").StructVisitor;
    compiler.addVisitor(new StructVisitor());

    const compileResult = compiler.compile();
    fs.writeFileSync(path.resolve("./spec/spec_bundle.js"), compileResult);
    console.log("compiled in", (Date.now() - start), "ms");

}