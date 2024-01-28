

export default class mockData {

  constructor(http, tokenStorage) {
    this.http = http;
    // this.tokenStorage = tokenStorage;
  }
  async getProgressData() {
    return this.http.get('/mockData/mockProgressData');
  }

  async getFeedbackData() {
    return this.http.get('/mockData/mockFeedbackData');
  }

  async getQuestionData() {
    return this.http.get('/mockData/mockQuestionData');
  }

  async getNumberOfQuestions() {
    return this.http.get('/mockData/mockNumberOfQuestions');
  }

  async getAssignmentTypes() {
    return this.http.get('/mockData/mockAssignmentType');
  }

  async getNotificationData() {
    return this.http.get('/mockData/mockNotifications');
  }

  async getModuleData() {
    return this.http.get('/mockData/mockModuleData');
  }

  async getTooltipItems() {
    return this.http.get('/mockData/mockTooltipitems');
  }

  async getAchievementRate() {
    return this.http.get('/mockData/mockAchievementRateItems');
  }

  async getAnalyticsDatas() {
    return this.http.get('/mockData/mockAnalyticsDatas');
  }

  async getMilestones() {
    return this.http.get('/mockData/mockMilestoneItems');
  }

  async getAssignments() {
    return this.http.get('/mockData/mockAssignmentItems');
  }

  async getMasteries() {
    return this.http.get('/mockData/mockTopMasteries');
  }

  async getProfile() {
    return this.http.get('/mockData/mockProfile');
  }

  async getLanguages() {
    return this.http.get('/mockData/mockLanguageItems');
  }

  async getDifficulties() {
    return this.http.get('/mockData/mockDifficultyItems');
  }

  async getFilters() {
    return this.http.get('/mockData/mockFilterItems');
  }

  async getPracticeItems(params) {
    const keyword = params.search;
    const { options } = params;
    const { multiOptions } = params;
    return this.http.get('/mockData/mockPracticeItems');
    const data = await response.json();

    let filteredItems = data.filter((item) => item.title.toLowerCase().includes(keyword.toLowerCase()));

    for (const key in options) {
      if (key == 'sortBy') {
        options[key] == '2' && filteredItems.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    const { languages } = multiOptions;

    const levelRanges = {
      1: [1, 4],
      2: [5, 8],
      3: [9, 12],
    };

    if (languages.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        const itemLanguages = item.languages.map((lang) => lang.id);
        return languages.every((lang) => itemLanguages.includes(lang));
      });
    }

    return filteredItems;
  }

  async getUsers() {
    return this.http.get('/mockData/mockUsers');
  }

  async getStudents(keyword) {
    return this.http.get('/mockData/mockStudents');
    const data = await response.json();

    const filteredItems = data.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()));

    return filteredItems;
  }

  async getWeekProgress() {
    return this.http.get('/mockData/mockWeekProgressItems');
  }

  async getShowMeChecked() {
    return this.http.get('/mockData/mockShowMeChecked');
  }

  async getNotiChecked() {
    return this.http.get('/mockData/mockNotiChecked');
  }

  async addClass(code) {
    const data = await this.getProfile();
    const addedData = [...data[0].classes,
    {
      id: data[0].classes.length + 1,
      name: 'new course',
      description: `code: ${code}`,
      img: '',

    },
    ];

    return addedData;
  }

  async getTopicCategory() {
    return this.http.get('/mockData/mockTopicItems');
  }

  async getStudentModules() {
    return this.http.get('/mockData/mockStudentModuleItems');
  }

  async getInfoQuestion() {
    return this.http.get('/mockData/mockInfoQuestionItems');
  }

  async getInfoCategories() {
    return this.http.get('/mockData/mockInfoCategories');
  }

  async getUserManual() {
    return this.http.get('/mockData/mockUserManual');
  }

  async getQuestionCategories() {
    return this.http.get('/mockData/mockQuestionCategoryItems');
  }


}


