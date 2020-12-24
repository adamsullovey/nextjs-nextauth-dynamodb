# make local builds go smoother by deleting some junk
rm -rf netlify-automatic-functions dist

# the functions need AWS credentials, but Netlify blocks me from entering variables with names like AWS_REGION in the GUI
# so set these up another way
# DB_AWS_REGION, DB_AWS_ACCESS_KEY_ID, and DB_AWS_SECRET_ACCESS_KEY must be configured in Netlify
# this will put their values into a .env file with the regular names the AWS SDK expects
# inspired by https://remysharp.com/2019/05/18/aws-inside-netlify
cat > ./.env <<EOL
AWS_REGION= $DB_AWS_REGION
AWS_ACCESS_KEY_ID=$DB_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$DB_AWS_SECRET_ACCESS_KEY
EOL

# is this being generated the way I expect?
cat .env

# finally build the site
yarn build
