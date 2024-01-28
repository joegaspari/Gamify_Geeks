export default class dataService {
    constructor(http, tokenStorage) {
        this.http = http;
        this.tokenStorage = tokenStorage;
    }

    getHeaderToken() {
        const token = this.tokenStorage.getToken();
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async getProfile(studentId) {
        const endpoint = studentId ? `/profile?studentId=${studentId}` : `/profile`;
        return this.http.get(endpoint, {
            headers: this.getHeaderToken(),
        });
    }

    async getLeaderboardItems() {
        return this.http.get(`/dashboard/leaderboard`, {
            headers: this.getHeaderToken(),
        });
    }

    async getAchievementRate() {
        return this.http.get(`/dashboard/achievements`, {
            headers: this.getHeaderToken(),
        });
    }

    async getClasses(search = "") {
        return this.http.get(`/profile/classes?search=${search}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getPracticeItems(params) {
        return this.http.post(`/explore/topicCard`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify(params),
        });
    }

    async getLanguages() {
        return this.http.get(`/explore/languages`, {
            headers: this.getHeaderToken(),
        });
    }

    async getDifficulties() {
        return this.http.get(`/explore/difficulties`, {
            headers: this.getHeaderToken(),
        });
    }

    async getTopicLanguages(topicId) {
        return this.http.get(`/explore/languagesBytopic/${topicId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getQuestion(params) {
        const { topicId, language, difficulty } = params;
        return this.http.post(
            `/question/getQ`,
            {
                headers: this.getHeaderToken(),
                body: JSON.stringify({
                    topicId,
                    languageId: language,
                    difficultyId: difficulty,
                }),
            },
            true
        );
    }

    async submitAnswer(params) {
        const { id, answer } = params;
        return this.http.post(
            `/question/answer`,
            {
                headers: this.getHeaderToken(),
                body: JSON.stringify({
                    id,
                    answer,
                }),
            },
            true
        );
    }

    async submitAssignmentAnswer(params) {
        const { id, answer, assignmentId } = params;
        return this.http.post(
            `/assignment/getAssignmentQAnswer`,
            {
                headers: this.getHeaderToken(),
                body: JSON.stringify({
                    id,
                    answer,
                    assignmentId,
                }),
            },
            true
        );
    }

    async saveAnswer(params) {
        const { id, answer } = params;
        return this.http.post(`/question/onSave`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                id,
                answer,
            }),
        });
    }

    async getMilestones(studentId) {
        return this.http.get(`/dashboard/milestones?studentId=${studentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getHint(qId) {
        return this.http.post(
            `/question/hint`,
            {
                headers: this.getHeaderToken(),
                body: JSON.stringify({
                    qId: qId,
                }),
            },
            true
        );
    }

    async reportQuestion(qId) {
        return this.http.post(`/question/report`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                qId: qId,
            }),
        });
    }

    async getAttemptedQuestions() {
        return this.http.get(`/explore/attemptedQuestions`, {
            headers: this.getHeaderToken(),
        });
    }

    async joinClass(code) {
        return this.http.post(`/profile/joinClass`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                joinCode: code,
            }),
        });
    }

    async getMasteries(studentId) {
        return this.http.get(`/dashboard/masteries?studentId=${studentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getBadges(studentId) {
        return this.http.get(`/dashboard/badges?studentId=${studentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getClassOverview() {
        return this.http.get(`/instructor/overview`, {
            headers: this.getHeaderToken(),
        });
    }

    async createClass(newClassInfo) {
        const { name, description } = newClassInfo;
        return this.http.post(`/instructor/createClass`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                name,
                description,
            }),
        });
    }

    async editClass(classEditInfo) {
        const { name, description, classId } = classEditInfo;
        console.log(classEditInfo);
        return this.http.put(`/instructor/edit`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                name,
                description,
                classId,
            }),
        });
    }

    async deleteClass(classId) {
        return this.http.delete(`/instructor/delete`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId: classId,
            }),
        });
    }

    async getStudentQuestions(params) {
        const { classId, assignmentId } = params;
        return this.http.post(`/assignment/linkStudentAssignment`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                assignmentId,
            }),
        });
    }

    async getStudentQuestions(params) {
        const { classId, assignmentId } = params;
        return this.http.post(`/assignment/linkStudentAssignment`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                assignmentId,
            }),
        });
    }

    async saveAssignmentQuestion(params) {
        const { questionId, textContent, assignmentId } = params;
        return this.http.post(`/assignment/saveAssignmentQuestion`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                questionId,
                textContent,
                assignmentId,
            }),
        });
    }

    async getStudentClassModule(params) {
        const { userId, classId } = params;
        return this.http.post(`/classModule/getStudentClassModule`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                userId,
                classId,
            }),
        });
    }

    async getInstructorClassModules(classId) {
        return this.http.post(`/classModule/getInstructorClassModule`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
            }),
        });
    }

    async getStudents(info) {
        const { classId, search } = info;
        return this.http.post(`/assignment/studentStats`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                search,
            }),
        });
    }

    async getStudentAnalytics(params) {
        const { classId, studentId } = params;
        return this.http.post(`/student/analytics`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                studentId,
            }),
        });
    }

    async getWeekProgress(params) {
        const { classId, studentId } = params;
        return this.http.post(`/student/weekly`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                studentId,
            }),
        });
    }

    async getClassLeaderboard(params) {
        const { classId, studentId } = params;
        return this.http.post(`/student/leaderboard`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                studentId,
            }),
        });
    }

    async getStudentModules(inforForStudentModules) {
        console.log(inforForStudentModules);
        const { classId, studentId } = inforForStudentModules;

        if (studentId == undefined) {
            return this.http.get(`/classModule/getStudentClassModule?classId=${classId}`, {
                headers: this.getHeaderToken(),
            });
        }

        return this.http.get(`/classModule/getStudentClassModule?classId=${classId}&studentId=${studentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getInstructorModules(classId) {
        return this.http.get(`/classModule/getInstructorClassModule?classId=${classId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async deleteModule(moduleInfo) {
        const { moduleId, classId } = moduleInfo;
        console.log(moduleInfo);
        return this.http.delete(`/classModule/deleteModule?moduleId=${moduleId}&classId=${classId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async changeModuleVisibility(moduleInfo) {
        const { moduleId, classId } = moduleInfo;
        return this.http.post(`/classModule/changeVis`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                moduleId,
                classId,
            }),
        });
    }

    async createModule(moduleInfo) {
        const { name, classId } = moduleInfo;
        return this.http.post(`/classModule/createModule`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                name,
                classId,
            }),
        });
    }

    async getStudentAnalyticsInstructor(classId) {
        return this.http.post(`/instructor/analytics`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
            }),
        });
    }

    async changeAssignmentVisibility(assignmentInfo) {
        const { moduleId, assignmentId } = assignmentInfo;
        return this.http.post(`/assignment/assignmentVis`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                moduleId,
                assignmentId,
            }),
        });
    }

    async getWeekProgressInstructor(classId) {
        return this.http.post(`/instructor/weekly`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
            }),
        });
    }

    async deleteAssignment(assignmentInfo) {
        const { moduleId, assignmentId } = assignmentInfo;
        return this.http.delete(`/assignment/inactivateA?moduleId=${moduleId}&assignmentId=${assignmentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async createAssignment(assignmentInfo) {
        console.log(assignmentInfo);
        const { moduleId, name, topicId, diffId, langId, numberOfQuestions, deadline } = assignmentInfo;
        return this.http.post(`/assignment/createAssignment`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                moduleId,
                name,
                topicId,
                diffId,
                langId,
                numberOfQuestions,
                deadline,
            }),
        });
    }

    async editAssignment(assignmentInfo) {
        const { assignmentId, name, deadline } = assignmentInfo;
        return this.http.post(`/assignment/editAssignment`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                assignmentId,
                name,
                deadline,
            }),
        });
    }

    async getClassLeaderboardInstructor(classId) {
        return this.http.post(`/instructor/leaderboard`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
            }),
        });
    }

    async getTotalStreaks(studentId) {
        return this.http.get(`/student/totalStreak?studentId=${studentId}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getMonthStreaks(info) {
        const { studentId, month, year } = info;
        return this.http.get(`/student/calStreak?studentId=${studentId}&month=${month}&year=${year}`, {
            headers: this.getHeaderToken(),
        });
    }

    async getUpcomingAssignments(params) {
        const { classId, studentId } = params;
        return this.http.post(`/assignment/upcoming`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                classId,
                studentId,
            }),
        });
    }

    async getNotifications() {
        return this.http.get(`/dashboard/notifications`, {
            headers: this.getHeaderToken(),
        });
    }

    async claimNotification(notificationId) {
        return this.http.put(`/dashboard/claim`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                notificationId,
            }),
        });
    }

    async getBadgeTitles() {
        return this.http.get(`/profile/titles`, {
            headers: this.getHeaderToken(),
        });
    }
}
