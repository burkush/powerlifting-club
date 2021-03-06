const content = document.querySelector('.tests-list');
const noTestsMessage = document.querySelector('.no-tests-message');

(async function getQuizzes() {
    content.classList.add("loading");
    const token = localStorage.getItem("Token");
    const user = JSON.parse(atob(token.split('.')[1]));
    
    const response = await fetch(`https://odbproject.herokuapp.com/api/quiz/my/${user.id}`, {
        method: "GET"
    });

    if (response.status === 200) {
        content.classList.remove("loading");
        
        const quizzes = await response.json()

        quizzes.map((quiz) => {
            const date = new Date(quiz.createdAt);

            content.innerHTML += `
            <div class="test-container" id="test-${quiz.id}">
                <div class="test-options">
                    <button type="button" class="delete-item-btn" onclick="openConfirmModal(${quiz.id})" title="Видалити">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <a class="test" href="./test.html?id=${quiz.id}">
                    <div>
                        <img src="${quiz.author.avatar}" />
                    </div>  
                    <div>    
                        <div>${quiz.author.name} ${quiz.author.surname}</div>
                        <div class="test-date">${date.toLocaleTimeString()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</div>
                        <div class="test-title">${quiz.name}</div>
                    </div>
                </a>
            </div>
            `;
        });

        if (content.innerHTML === '') {
            noTestsMessage.classList.remove('hide-message');
        }

    } else {
        throw new Error("Failed");
    }
})()
.catch(err => console.log(err.message))

// Delete tests

const confirmDeleteModal = document.querySelector('.confirm-delete-modal');

const closeConfirmBtn = document.querySelector('.close-confirm-modal');
closeConfirmBtn.addEventListener('click', closeConfirmModal);

const cancelBtn = document.querySelector('.cancel-btn');
cancelBtn.addEventListener('click', closeConfirmModal);

document.addEventListener('click', clickOutsideConfirm);
document.addEventListener('keyup', escapeCloseConfirm);

function openConfirmModal(id) {
    confirmDeleteModal.style.display = 'block';
    
    const deleteBtn = document.querySelector('.yes-btn');
    deleteBtn.addEventListener('click', () => deleteTest(id));
}

function closeConfirmModal() {
    confirmDeleteModal.style.display = 'none';

    const oldBtnElement = document.querySelector(".yes-btn");
    const newBtnElement = oldBtnElement.cloneNode(true);
    oldBtnElement.parentNode.replaceChild(newBtnElement, oldBtnElement);
}

function clickOutsideConfirm (event) {
    if(event.target === confirmDeleteModal) {
        closeConfirmModal();
    }
}

function escapeCloseConfirm (event) {
    if (event.keyCode === 27) {
        closeConfirmModal();
    }
}

async function deleteTest(id) {
    const response = await fetch(`https://odbproject.herokuapp.com/api/quiz/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("Token"),
        }
    });

    if(response.status === 204) {
        item = document.querySelector(`#test-${id}`);
        item.remove();
    }

    closeConfirmModal();

    document.location.reload();
}