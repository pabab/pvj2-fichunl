BASE_DELAY=450
for i in $(ls -d */); 

	do echo ${i%%/};
	convert -delay ${BASE_DELAY} -loop 0 ${i%%/}/*.png ${i%%/}.gif
	let BASE_DELAY=BASE_DELAY+20
done; 
