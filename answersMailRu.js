watchIgnoreList();

function watchIgnoreList() {
	let repList;
	let ignoreList = JSON.parse(localStorage.getItem('ignoreList')) || [];

	setInterval(() => {
		repList = document.querySelectorAll('.O7e15');

		for (let node of repList) {
			let link = node.querySelector('._yoNC');

			if (!link.dataLoaded) {
				let ignoreLink = document.createElement('a');
				let div = document.createElement('div');
				ignoreLink.innerText = '[ Ignore ]';
				ignoreLink.href = '#';
				ignoreLink.addEventListener('click', function (event) {
					addToIgnoreList(link.href);
				});
				div.append(ignoreLink);

				link.append(div);
				link.dataLoaded = true;
			}

			ignoreList.forEach(profileLink => {
				if (link.href.includes(profileLink)) {
					node.remove();
				}
			});
		}
	}, 1000);

	function addToIgnoreList(profileLink) {
		ignoreList.push(profileLink);
		localStorage.setItem('ignoreList', JSON.stringify(ignoreList));
	}
}
