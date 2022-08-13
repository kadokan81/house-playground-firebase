import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

const Category = () => {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListing, setLastFetchedListing] = useState(null);
	const params = useParams();

	useEffect(() => {
		const fetchListingThing = async () => {
			try {
				const lictingRef = collection(db, 'listings');

				//Create query
				const q = query(
					lictingRef,
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),

					limit(2)
				);

				//Excute query
				const querySnap = await getDocs(q);
				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				setLastFetchedListing(lastVisible);

				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setListings(listings);
				setLoading(false);
			} catch (error) {
				console.log('errro---->', error);
			}
		};

		fetchListingThing();
	}, [params.categoryName]);

	const onFetchMoreListings = async () => {
		try {
			const lictingRef = collection(db, 'listings');

			//Create query
			const q = query(
				lictingRef,
				where('type', '==', params.categoryName),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(3)
			);

			//Excute query
			const querySnap = await getDocs(q);

			const lastVisible = querySnap.docs[querySnap.docs.length - 1];

			setLastFetchedListing(lastVisible);

			const listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings((prevState) => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			console.log('errro---->', error);
		}
	};

	return (
		<div className='category'>
			<header>
				<p className='pageHeader'>
					{params.categoryName === 'rent'
						? 'Places for rent'
						: 'Places for sale'}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className='categoryListings'>
							{listings.map((listing, ind) => (
								<ListingItem
									listing={listing.data}
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>
					<br />
					<br />
					{lastFetchedListing && (
						<p className='loadMore' onClick={onFetchMoreListings}>
							Load More
						</p>
					)}
				</>
			) : (
				<p>No listings for {params.categoryName}</p>
			)}
		</div>
	);
};

export default Category;
