/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.voronoi.visibility');

goog.require('jspb.ExtensionFieldBinaryInfo');
goog.require('jspb.ExtensionFieldInfo');
goog.require('proto.google.protobuf.FieldOptions');


/**
 * A tuple of {field number, class constructor} for the extension
 * field named `visibility`.
 * @type {!jspb.ExtensionFieldInfo.<!proto.voronoi.Visibility>}
 */
proto.voronoi.visibility = new jspb.ExtensionFieldInfo(
    314150,
    {visibility: 0},
    null,
     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
         null),
    0);

proto.google.protobuf.FieldOptions.extensionsBinary[314150] = new jspb.ExtensionFieldBinaryInfo(
    proto.voronoi.visibility,
    jspb.BinaryReader.prototype.readEnum,
    jspb.BinaryWriter.prototype.writeEnum,
    undefined,
    undefined,
    false);
// This registers the extension field with the extended class, so that
// toObject() will function correctly.
proto.google.protobuf.FieldOptions.extensions[314150] = proto.voronoi.visibility;

