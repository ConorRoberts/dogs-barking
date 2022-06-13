yarn tsc
cp package.json dist
cd dist && npm version patch && npm publish && cd ..
rm dist