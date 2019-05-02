
const users = {
  withoutUsername: {
    email: 'hadad@andela.com',
    password: 'Hadad12@'
  },
  withoutEmail: {
    username: 'dusmel',
    password: 'Hadad12@'
  },
  wrongEmailFormat: {
    username: 'dusmel',
    email: 'hadad2andela.com',
    password: 'Hadad12@'
  },
  wrongPasswordFormat: {
    username: 'dusmel',
    email: 'hadad3@andela.com',
    password: 'Hadadss'
  },
  correct: {
    username: 'dusmel',
    email: 'hadad_test@andela.com',
    password: 'Hadad12@'
  },
  correctUserForComment: {
    username: 'karl',
    email: 'karl_test_comment@andela.com',
    password: 'Hadad12@'
  },
  correctLogout: {
    username: 'dusmel12',
    email: 'hadad_test_11@andela.com',
    password: 'Hadad12@'
  },
  wrongLogInfo: {
    email: 'hadad_test@andela.com',
    password: 'Hadad12'
  },
  correctLogInfo: {
    email: 'hadad_test@andela.com',
    password: 'Hadad12@'
  },
  correctLikeArticle: {
    username: 'dusmel01',
    email: 'hadad_test01@andela.com',
    password: 'Hadad12@'
  },

};

export default users;
