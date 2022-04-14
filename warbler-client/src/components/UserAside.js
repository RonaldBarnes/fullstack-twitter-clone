
// Lecture 384 @ 03:10
// Displays info about currentUser


import React from "react";
import DefaultProfileImage from "../images/default-profile-image.jpg";

const UserAside = ({profileImageUrl, author}) => (
	<aside className="col-sm-2">
		<div className="panel panel-default">
			<img
				src={profileImageUrl || DefaultProfileImage}
				alt={author}
				className="img-thumbnail"
				width="200"
				height="200"
				/>
		</div>
	</aside>
	);

export default UserAside;

