
const users = {
  withoutUsername: {
    email: 'hadad@andela.com',
    password: 'Hadad12@'
  },
  withoutEmail: {
    username: 'dusmel1',
    password: 'Hadad12@'
  },
  wrongEmailFormat: {
    username: 'dusmel2',
    email: 'hadad2andela.com',
    password: 'Hadad12@'
  },
  wrongPasswordFormat: {
    username: 'dusmel3',
    email: 'hadad3@andela.com',
    password: 'Hadadss'
  },
  correct: {
    username: 'dusmel4',
    email: 'hadad_test@andela.com',
    password: 'Hadad12@'
  },
  correctUserForComment: {
    username: 'karl122',
    email: 'karl_test_comment@andela.com',
    password: 'Hadad12@'
  },
  correctLogout: {
    username: 'dusmel125',
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
    username: 'dusmel016',
    email: 'hadad_test01@andela.com',
    password: 'Hadad12@'
  },
  correctNotificationArticle: {
    email: 'hadad_test01@andela.com',
    password: 'Hadad12@'
  },
  correctCreateArticle: {
    username: 'karlArticle7',
    email: 'karl_test_Article@andela.com',
    password: 'Hadad12@'
  },
  adminCreateWithoutFnameLname: {
    username: 'dusmel128',
    email: 'hadad_test_11@andela.com',
    password: 'Hadad12@'
  },
  adminCreateWrongUsername: {
    firstname: 'hadad',
    lastname: 'dus',
    username: 'mutombo',
    email: 'hadad_test_11@andela.com',
    password: 'Hadad12@'
  },
  adminCreateUser: {
    firstname: 'hadad',
    lastname: 'dus',
    username: 'dusmel111',
    email: 'hadad_test_11@andela.com',
    password: 'Hadad12@'
  },
  adminUpdateWrongEmail: {
    firstname: 'hadad1',
    lastname: 'bwenge',
    email: 'sigmacool@gmail.com',
    password: 'Hadd2dd',
    image: 'http://hdsjsdhsj.zx',
    bio: 'sdjhsjdhsjdhs'
  },
  adminUpdateWrongImageurl: {
    firstname: 'hadad1',
    lastname: 'bwenge',
    email: 'hadad_test_11@andela.com',
    password: 'Hadd2dd',
    image: 'hdsjsdhsj.zx',
    bio: 'sdjhsjdhsjdhs'
  },
  adminUpdate: {
    firstname: 'hadad1',
    lastname: 'bwenge',
    email: 'hadad.bwenge@andela.com',
    password: 'Hadd2dd',
    image: 'http://hdsjsdhsj.zx',
    bio: 'sdjhsjdhsjdhs'
  },
  adminUpdateSameEmail: {
    firstname: 'hadad1',
    lastname: 'bwenge',
    email: 'hadad.bwenge@andela.com',
    password: 'Hadd2dd',
    image: 'http://hdsjsdhsj.zx',
    bio: 'sdjhsjdhsjdhs'
  },

};

export default users;
