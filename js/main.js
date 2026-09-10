const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

// 프로젝트 분류 자동 설정
projectCards.forEach((card, index) => {
    if (index === 0) {
        card.dataset.category = "cloud";
    } else {
        card.dataset.category = "landing";
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // 선택 버튼 표시
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // 프로젝트 필터링
        projectCards.forEach((card) => {

            if (
                filter === "all" ||
                card.dataset.category === filter
            ) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }

        });

    });
});