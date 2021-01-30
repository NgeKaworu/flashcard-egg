export const ucHost = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://api.furan.xyz/user-center';
    default:
      return 'http://localhost:8011';
  }
};
