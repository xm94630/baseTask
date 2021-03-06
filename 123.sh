# !/bin/sh

git filter-branch --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

if [ "$GIT_COMMITTER_EMAIL" = "xuming3@yiche.com" ]
then
    cn="xm94630"
    cm="xm94630@126.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "xuming3@yiche.com" ]
then
    an="xm94630"
    am="xm94630@126.com"
fi

export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'