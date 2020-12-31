# make local builds go smoother by deleting some junk
rm -rf netlify-automatic-functions dist

# the functions need AWS credentials, but Netlify blocks me from entering variables with names like AWS_REGION in the GUI
# so I use the library-agnostic names DB_AWS_REGION, DB_AWS_ACCESS_KEY_ID, and DB_AWS_SECRET_ACCESS_KEY in Netlify as a workaround
# and write out an Omanyd libary-specific .env file for the application to use
# Omanyd is a library used by the NextAuth.js DynamoDB extension I chose
# inspired by https://remysharp.com/2019/05/18/aws-inside-netlify
cat > ./.env <<EOL
OMANYD_AWS_REGION=$DB_AWS_REGION
OMANYD_AWS_ACCESS_KEY_ID=$DB_AWS_ACCESS_KEY_ID
OMANYD_AWS_SECRET_ACCESS_KEY=$DB_AWS_SECRET_ACCESS_KEY
EOL

# is .env being generated the way I expect? write out one line with the region so I can see it
head -1 .env

# finally build the site
yarn build
