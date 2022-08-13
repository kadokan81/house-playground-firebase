import { updateProfile } from 'firebase/auth';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase.config';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import { deleteObject, getStorage, ref } from 'firebase/storage';

export const Profile = () => {
	const [loading, setloading] = useState(true);
	const [formData, setFormdata] = useState({
		name: auth.currentUser?.displayName || '',
		email: auth.currentUser?.email || '',
	});
	const [userListings, setUserListings] = useState(null);

	const { name, email } = formData;

	const [changeDetails, setChangeDetails] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchuserListings = async () => {
			const listingsRef = collection(db, 'listings');
			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid)
			);

			const quetySnap = await getDocs(q);

			const lintings = [];
			quetySnap.forEach((doc) => {
				return lintings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setUserListings(lintings);
			setloading(false);
		};
		fetchuserListings();
	}, []);
	const onLogout = () => {
		auth.signOut();
		toast.success('You are successfully logout');
		navigate('/');
	};
	const onChangeHandler = (e) => {
		setFormdata((prev) => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};
	const onSubmitHandler = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});

				const userRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
				});
				toast.success(`New name is :${name}`);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete?')) {
			const docRef = doc(db, 'listings', listingId);

			const docSnap = await getDoc(docRef);
			let imgUrls = [];

			if (docSnap.exists()) {
				imgUrls = [...docSnap.data().imgUrls];
			}
			const storage = getStorage();

			imgUrls.forEach((url) => {
				const desertRef = ref(storage, url);

				deleteObject(desertRef)
					.then(() => {
						console.log('delete img ok');
					})
					.catch((error) => {
						console.log('delete  img error', error);
					});
			});

			await deleteDoc(doc(db, 'listings', listingId));
			const updateListings = userListings.filter(
				(listing) => listing.id !== listingId
			);
			setUserListings(updateListings);
			toast.success('Successfully deleted listing');
		}
	};
	const onEdit = (id) => navigate(`/edit-listing/${id}`);

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='profile'>
			<header className='profileHeader'>
				<p className='pageHeader'>My profile</p>

				<button className='logOut' type='button' onClick={onLogout}>
					Log Out
				</button>
			</header>
			<main>
				<div className='profileDetailsHeader'>
					<p className='profileDetailsText'>Personal Details</p>
					<p
						className='changePersonalDetails'
						onClick={() => {
							changeDetails && onSubmitHandler();
							setChangeDetails((prev) => !prev);
						}}>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>

				<div className='profileCard'>
					<form>
						<input
							type='text'
							id='name'
							className={!changeDetails ? 'profileName' : 'profileNameActive'}
							disabled={!changeDetails}
							value={name}
							onChange={onChangeHandler}
						/>
						<input
							type='text'
							id='email'
							className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
							disabled={!changeDetails}
							value={email}
							onChange={onChangeHandler}
						/>
					</form>
				</div>
				<Link to='/create-listing' className='createListing'>
					<img src={homeIcon} alt='home' />
					<p>Sell or rent your home</p>
					<img src={arrowRight} alt='arrow right' />
				</Link>
				{!loading && userListings?.length > 0 && (
					<>
						<p className='listingText'>Your Listings</p>
						<ul className='listingsList'>
							{userListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onDelete={() => onDelete(listing.id)}
									onEdit={() => onEdit(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
};
