module.exports = {
    session_secret : process.env.SESSIONS_SECRET || "51eec1f4-1bbc-4272-8c6f-1a130ce2bb0d",
    jwt_secret : process.env.JWT_SECRET || "fc8b4884-6516-41c6-b139-37e4ff5e2b62",
    webtoken : process.env.API_WEBTOKEN || "cdbf4131-b2a3-4a91-be1d-ee1d38c07ed9",
    vapid_public_key: process.env.PUSH_VAPID_PUBLIC_KEY || "BJbfZdaC9Spee-QbF4ZM2Oj7JOlgKCCm2FbAwDMzdp4YvYrl0fLGfk2lZ9An1BSlMs9gt8k6Dn4nnz59QwTp3Hk",
    vapid_private_key: process.env.PUSH_VAPID_PRIVATE_KEY || "mjzh3kgwMn7dNkvaI9Jbx5SLowzguHOE-JUfZW8lYSI"
};