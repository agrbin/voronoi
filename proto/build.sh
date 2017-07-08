protoc \
  --js_out=import_style=commonjs,binary:generated_js \
  --cpp_out=generated_cc \
  voronoi.proto
